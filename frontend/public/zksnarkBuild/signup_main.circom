pragma circom 2.0.0; include "../circuits/signup.circom"; 

component main { public [ attester_id, epoch ] } = Signup(6);