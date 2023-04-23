pragma circom 2.0.0; include "../circuits/proveReputation.circom"; 

component main { public [ graffiti_pre_image, sig_data ] } = ProveReputation(17, 2, 4, 6);