print("SCRIPT STARTED");

function setupBlackholes(){
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        print("❌ BLACKHOLE NOT FOUND — maybe the mod didn’t load yet");
        return;
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType);

    // Only attach logic if you want units/bullets pulled, else skip
}

if(Vars.world != null){
    setupBlackholes(); // world already loaded, run immediately
} else {
    Events.on(WorldLoadEvent, cons(() => setupBlackholes())); // wait for load
}

print("SCRIPT READY");