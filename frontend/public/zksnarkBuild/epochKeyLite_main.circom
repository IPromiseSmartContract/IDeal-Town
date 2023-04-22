pragma circom 2.0.0; include "../circuits/epochKeyLite.circom"; 

component main { public [ sig_data ] } = EpochKeyLite(2);