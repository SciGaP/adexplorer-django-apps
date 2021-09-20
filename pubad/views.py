#django related imports
from django.shortcuts import render
from datamanage.models import *
from pubad.models import *
from adgene.models import *
from datamanage.forms import *
from django.conf import settings
from django.http import HttpResponse, JsonResponse

#python related imports
import uuid
import json
import pandas as pd
import ast
from operator import itemgetter
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from io import BytesIO
import base64
from django_pandas.io import read_frame


############################
##### Helper Functions #####
############################
def GetRealGeneName(gene_name):
    #if the inout is something selected from the auto complete list:
    if '(GeneSymbol:' in gene_name:
        return gene_name.split(':')[1].split(',')[0]
    #make all gene name upper case
    gene_name=gene_name.upper()
    #if the input is gene symbol or ESEMBL id( lower or upper case)
    if GeneAliasesPub.objects.filter(gene_symbol=gene_name).exists():
        return gene_name
    else:
        if GeneAliasesPub.objects.filter(aliases=gene_name).exists():
            gene_symbol_list=GeneAliasesPub.objects.filter(aliases=gene_name).values_list('gene_symbol', flat=True)
            if len(gene_symbol_list)==1:
                return gene_symbol_list[0]
            #multiple genes identified in database according to input
            else:
                records_found=GeneAliasesPub.objects.filter(aliases=gene_name).values_list('gene_aliases_note', flat=True)
                records_found=list(set(records_found))
                output={}
                output['records']=records_found
                return output
        #if did not find any records in database
        else:
            return False


def PubDataPrepare(pub_info, pub_count_name, pub_pmid_name):
    if type(pub_info[pub_count_name]) == str:
        pub_c=ast.literal_eval(pub_info[pub_count_name])
        pub_p=ast.literal_eval(pub_info[pub_pmid_name])
        from_str=True
    else:
        pub_c=pub_info[pub_count_name]
        pub_p=pub_info[pub_pmid_name]
        from_str=False
    pub_final=[]
    for curr_i in pub_c.keys():
        curr_rec={'name':curr_i}
        curr_rec['pub_count']=pub_c[curr_i]
        if from_str:
            pub_p[curr_i]=[str(i) for i in pub_p[curr_i]]
        else:
            pub_p[curr_i]=pub_p[curr_i].split(',')
        #control length
        if len(pub_p[curr_i]) > 900:
            pub_p[curr_i]=pub_p[curr_i][0:900]
        curr_rec['pubmed_url']='https://www.ncbi.nlm.nih.gov/pubmed/'+','.join(pub_p[curr_i])
        pub_final.append(curr_rec)
    pub_final=sorted(pub_final, key=itemgetter('pub_count'))
    return pub_final
    
def PrepareGeneQuery(gene_name):
    #init a final output
    params={}
    #prepare gene information
    gene_info=GeneInfo.objects.filter(gene_symbol=gene_name).values()[0]
    params['gene_info']=gene_info
    '''
    ##############
    inhouse data preapre
    ##############
    '''
    #get PubInfo record 
    pub_info=PubInfo.objects.filter(gene_symbol=gene_name).values()[0]
    
    '''process year count info'''
    year_c_rec=ast.literal_eval(pub_info['year_count'])
    year_p_rec=ast.literal_eval(pub_info['year_pmid'])
    year_c_keys=list(year_c_rec.keys())
    year_c_keys.sort()
    year_c=[{'year':i, 'count':year_c_rec[i], 'pubmed_url':'https://www.ncbi.nlm.nih.gov/pubmed/'+','.join( [str(i) for i in year_p_rec[i]] )} for i in year_c_keys]
    params['year_final']=json.dumps(year_c)
    
    '''process DementiaType info'''
    dt_c=ast.literal_eval(pub_info['demtype_count'])
    dt_p=ast.literal_eval(pub_info['demtype_pmid'])
    if len(dt_c) != 0:
        dt_names = {'AD': "Alzheimers Disease", 
                    'frontotemporal': 'Frontotemporal Dementia', 
                    'lewy':'Lewy Body Dementia', 
                    'vascular':'Vascular Dementia', 
                    'mixed':'Mixed Dementia', 
                    'parkinson':'Parkinsons Disease', 
                    'huntington':'Huntington Disease', 
                    'psp':'PSP'}
        dt_final=[]
        for curr_dt in dt_c.keys():
            curr_rec={'name':dt_names[curr_dt]}
            curr_rec['pub_count']=dt_c[curr_dt]
            dt_p[curr_dt]=[str(i) for i in dt_p[curr_dt]]
            #control length
            if len(dt_p[curr_dt]) > 900:
                dt_p[curr_dt]=dt_p[curr_dt][0:900]
            curr_rec['pubmed_url']='https://www.ncbi.nlm.nih.gov/pubmed/'+','.join(dt_p[curr_dt])
            dt_final.append(curr_rec)
        dt_final=sorted(dt_final, key=itemgetter('pub_count'))
        params['dt_final']=json.dumps(dt_final)
    else:
        params['dt_final']=None
    
    '''process BrainRegions info'''
    if len(ast.literal_eval(pub_info['br_count'])) !=0:
        br_final=PubDataPrepare(pub_info, 'br_count', 'br_pmid')
        params['br_final']=json.dumps(br_final)
    else:
        params['br_final']=None
    
    '''process MouseModels info'''
    if len(ast.literal_eval(pub_info['mm_count'])) !=0:
        mm_final=PubDataPrepare(pub_info, 'mm_count', 'mm_pmid')
        params['mm_final']=json.dumps(mm_final)
    else:
        params['mm_final']=None
    
    '''process KeyWords info'''
    if len(ast.literal_eval(pub_info['kw_count'])) !=0:
        kw_final=PubDataPrepare(pub_info, 'kw_count', 'kw_pmid')
        kw_final=kw_final[::-1]
        params['kw_final']=json.dumps(kw_final)
        params['kw_min']=kw_final[-1]['pub_count']
        params['kw_max']=kw_final[0]['pub_count']
        
        ''' prepare a word plot for key words '''
        plt.switch_backend('Agg')
        plt.figure( figsize=(25,18) )
        wordcloud = WordCloud(width=600, height=400, background_color="white", max_words=60, relative_scaling=0.1, prefer_horizontal=0.5)
        wordcloud.generate_from_frequencies(ast.literal_eval(pub_info['kw_count']))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis("off")
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_png = buffer.getvalue()
        buffer.close()
        graphic = base64.b64encode(image_png)
        graphic = graphic.decode('utf-8')
        plt.close()
        params['kw_wordcloud']=graphic
    else:
        params['kw_final']=None
    
    '''process Co-occurred Genes info'''
    cg_info=ast.literal_eval(pub_info['co_count'])
    if len(cg_info) != 0:
        #init a list for cg_final
        cg_final=[{'gene_name':g, 'count':c} for g,c in cg_info.items()]
        params['cg_final']=json.dumps(cg_final)
    else:
        params['cg_final']=None
    
    
    
    '''
    ##############
    CTD data preapre
    ##############
    '''
    #get ctd info as df
    ctd_info=read_frame(Pubctd.objects.filter(gene_symbol=gene_name).all())
    #check data avail
    if len(ctd_info) != 0:
        params['ctd_status']=True
        ctd_disease=sorted(list(set(ctd_info['disease'])))
        #add disease to params
        params['ctd_disease']=ctd_disease
        #init a dict for ctd_tab_info
        ctd_tab_info={}
        ctd_tab_plot={}
        for curr_disease in ctd_disease:
            curr_tab_rec={}
            curr_tab_plot={}
            curr_info_rec=ctd_info.loc[ctd_info['disease']==curr_disease].iloc[0,:]
            #add inference score to params
            curr_tab_rec['inf_score']=curr_info_rec['inf_score']
            #add total pubs
            curr_tab_rec['pub_count_all']=sum([v for k,v in curr_info_rec['chempub_count'].items()])
            #add total chems
            curr_tab_rec['chem_count_all']=len(curr_info_rec['chempub_count'])
            #get data for bar plot
            curr_tab_plot['plot_data']=PubDataPrepare(curr_info_rec, 'chempub_count', 'chempub_pmid')[::-1]
            curr_tab_plot['plot_data_min']=curr_tab_plot['plot_data'][-1]['pub_count']
            curr_tab_plot['plot_data_max']=curr_tab_plot['plot_data'][0]['pub_count']
            
            #curr_tab_rec['plot_data']=plot_data
            
            
            #add rec to ctd_tab_info
            ctd_tab_info[curr_disease]=curr_tab_rec
            #add rec to ctd_tab_plot
            ctd_tab_plot[curr_disease]=curr_tab_plot
        #add ctd_tab_info to params
        params['ctd_tab_info']=ctd_tab_info
        #add ctd_tab_plot to params
        params['ctd_tab_plot']=json.dumps(ctd_tab_plot)
        
        
    else:
        params['ctd_status']=False
        
    params['see']=ast.literal_eval(pub_info['kw_count'])
    return params




##########################
##### Main Functions #####
##########################

def index(request):    
    if request.method == 'GET':
        #set a result display status
        result_display_status='init'
        return render(request, 'pubad/index.html', {'result_display_status':result_display_status})
    elif request.method == 'POST':
        result_display_status='show_result'    
        #get input type: GeneQuery or BrainRegion or KeyWord
        input_type=request.POST.get('SearchCate')
        
        '''if input is single gene'''
        if input_type == 'GeneQuery':
            #get and process gene name
            gene_name_input=request.POST.get('GeneName')
            gene_name_check=GetRealGeneName(gene_name_input)
            if gene_name_check:
                if type(gene_name_check)==str:
                    ''' start => PubAD ::: GeneQuery ::: Main code '''
                    #define result_status => str, dict or false
                    result_status='result_status_str'
                    params=PrepareGeneQuery(gene_name_check)
                    ''' end => PubAD ::: GeneQuery ::: Main code '''
                    
                    return render(request, 'pubad/index.html', {'params':params, 
                                                                'result_display_status':result_display_status, 
                                                                'result_status':result_status, 
                                                                'input_type':input_type})
                elif type(gene_name_check)==dict:
                    #define result_status => str, dict or false
                    result_status='result_status_dict'
                    #return a search page with recommend gene list
                    recommend_gene_list=gene_name_check['records']
                    term_searched=gene_name_input
                    return render(request, 'pubad/index.html', {'recommend_gene_list': recommend_gene_list, 'result_display_status':result_display_status, 'input_type':input_type, 'term_searched':term_searched, 'result_status':result_status})
            else:
                #define result_status => str, dict or false
                result_status='result_status_false'
                term_searched=gene_name_input
                return render(request, 'pubad/index.html', {'result_display_status':result_display_status, 'input_type':input_type, 'result_status':result_status, 'term_searched':term_searched})





















##########################
##### Ajax Functions #####
##########################

def get_genenames_pubad(request):
    if request.is_ajax():
        q = request.GET.get('term', '')
        gene_info = GeneAliasesPub.objects.filter(aliases__icontains=q).values_list('gene_aliases_note', flat=True)
        gene_info=list(set(gene_info))[:15]
        gene_info.sort()
        results = []
        for gene in gene_info:
            gene_json = {}
            gene_json['value'] = gene
            results.append(gene_json)
        if len(results)==0:
            results=[{'value':'Gene NOT in Database'}]
        data = json.dumps(results)
    else:
        data = 'fail'
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)



