print("SCRIPT STARTED");

function setupBlackhole(){
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        // not ready yet, check again next tick
        Time.runTask(1, setupBlackhole);
        return;
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType);

    // now you can safely attach logic or just detect
}

// run immediately if world is loaded, else wait
if(Vars.world != null){
    setupBlackhole();
} else {
    Events.on(WorldLoadEvent, cons(() => setupBlackhole()));
}

print("SCRIPT READY");