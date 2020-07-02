import timeit

setup = '''
import numpy, pandas
df = pandas.DataFrame(numpy.zeros(shape=[10, 1000]))
dictionary = df.to_dict()
'''

# f = ['value = dictionary[5][5]', 'value = df.loc[5, 5]', 'value = df.iloc[5, 5]']
f = ['value = [val[5] for col,val in dictionary.items()]', 'value = df.loc[5]', 'value = df.iloc[5]']

for func in f:
    print(func)
    print(min(timeit.Timer(func, setup).repeat(3, 10000)))