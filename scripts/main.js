print("LOADER STARTED");
try {
    require('suit');
} catch(e){
    print("Suit script failed:", e);
}

try {
    require('blackholePull');
} catch(e){
    print("Blackhole script failed:", e);
}