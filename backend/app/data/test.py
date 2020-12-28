import pandas

data = pandas.read_csv('./signatures.tsv', sep='\t').rename(columns={'Unnamed: 0': 'Name'})
print(data)