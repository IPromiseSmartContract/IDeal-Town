pragma circom 2.0.0; include "../circuits/userStateTransition.circom"; 

component main { public [ to_epoch, attester_id ] } = UserStateTransition(17, 17, 17, 2, 6, 4, 48);