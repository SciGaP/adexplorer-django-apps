from django.db import models

# Create your models here.
class PubInfo(models.Model):
    pubinfo_record_id=models.AutoField(primary_key=True)
    gene_symbol=models.CharField(max_length=100, null=True)
    demtype_count=models.CharField(max_length=1000, null=True)
    demtype_pmid=models.TextField(max_length=100000, null=False) 
    br_count=models.CharField(max_length=1000, null=True)
    br_pmid=models.TextField(max_length=100000, null=False) 
    mm_count=models.CharField(max_length=1000, null=True)
    mm_pmid=models.TextField(max_length=100000, null=False) 
    kw_count=models.CharField(max_length=1000, null=True)
    kw_pmid=models.TextField(max_length=100000, null=False) 
    year_count=models.TextField(max_length=1000, null=False) 
    year_pmid=models.TextField(max_length=100000, null=False) 
    co_count=models.JSONField()
    def __str__(self):
        return '%d %s %s %s %s %s %s %s %s %s %s %s %s' % (self.pubinfo_record_id, self.gene_symbol, self.demtype_count, self.demtype_pmid, self.br_count, self.br_pmid, self.mm_count, self.mm_pmid, self.kw_count, self.kw_pmid, self.year_count, self.year_pmid, self.co_count)

class Pubctd(models.Model):
    pubctd_record_id=models.AutoField(primary_key=True)
    gene_symbol=models.CharField(max_length=100, null=True)
    disease=models.CharField(max_length=100, null=False)
    chempub_count=models.JSONField()
    chempub_pmid=models.JSONField()
    inf_score=models.FloatField(null=True)
    def __str__(self):
        return '%d %s %s %s %s %d' % (self.pubctd_record_id, self.gene_symbol, self.disease, self.chempub_count, self.chempub_pmid, self.inf_score)
    
    

class GeneAliasesPub(models.Model):
    ga_record_id=models.AutoField(primary_key=True)
    gene_symbol=models.CharField(max_length=500, null=False)
    aliases=models.CharField(max_length=500, null=True)
    gene_aliases_note=models.CharField(max_length=500, null=True)
    def __str__(self):
        return '%d %s %s %s' % (self.ga_record_id, self.gene_symbol, self.aliases, self.gene_aliases_note)

class GeneInfo(models.Model):
    geneinfo_record_id=models.AutoField(primary_key=True)
    gene_symbol=models.CharField(max_length=100, null=True)
    gene_aliases=models.CharField(max_length=1000, null=True)
    gene_description=models.CharField(max_length=1000, null=True)
    gene_other_designations=models.CharField(max_length=1000, null=True)
    gene_map_location=models.CharField(max_length=100, null=True)
    gene_chromosome=models.CharField(max_length=50, null=True)
    entrez_id=models.CharField(max_length=100, null=True)
    ensembl_id=models.CharField(max_length=100, null=True)
    uniprot_id=models.CharField(max_length=100, null=True)
    refseq_accession=models.CharField(max_length=100, null=True)
    chembl_target_id=models.CharField(max_length=100, null=True)
    
    def __str__(self):
        return '%d %s %s %s %s %s %s %s %s %s %s %s' % (self.geneinfo_record_id, self.gene_symbol, self.gene_aliases, self.gene_description, self.gene_other_designations, self.gene_map_location, self.gene_chromosome, self.entrez_id, self.ensembl_id, self.uniprot_id, self.refseq_accession, self.chembl_target_id)
