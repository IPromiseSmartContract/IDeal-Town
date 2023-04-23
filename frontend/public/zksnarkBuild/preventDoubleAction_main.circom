pragma circom 2.0.0; include "../circuits/preventDoubleAction.circom"; 

component main { public [ sig_data ] } = PreventDoubleAction(17, 2, 6);