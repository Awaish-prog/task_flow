from fractional_indexing_jittered import generate_key_between, generate_n_keys_between, generate_jittered_key_between


key = 'a1'
first_key = generate_key_between(None, None)

for i in range(100):
    key = generate_jittered_key_between(first_key, key)
    print(key, end=" ")

# print(generate_n_keys_between(None, None, 90000))

# a000000000000000FMR
# a0000000000000000LFT

