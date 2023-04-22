pragma circom 2.0.0; include "../circuits/epochKey.circom"; 

component main { public [ sig_data ] } = EpochKey(17, 2, 6);