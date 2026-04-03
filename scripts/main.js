print("SCRIPT STARTED");

function setupBlackhole(){
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        // not ready yet, check again next tick
        Time.runTask(1, setupBlackhole);
        return;
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType);

    // Function to attach pull behavior to a blackhole unit instance
    function attachPull(unit){
        if(unit.blackholeAttached) return; // only attach once
        unit.blackholeAttached = true;

        const oldUpdate = unit.update;
        unit.update = function(){
            oldUpdate.call(this);

            let radius = 300;   // pull radius
            let strength = 150;  // pull strength, increase if bullets are too fast

            // Pull units
            Groups.unit.intersect(
                this.x - radius,
                this.y - radius,
                radius*2,
                radius*2,
                cons(u => {
                    if(!u || u.dead || u.isPlayer() || u === this) return;
                    let dx = this.x - u.x;
                    let dy = this.y - u.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;
                    dx /= dist; dy /= dist;
                    u.vel.add(dx * strength * (1 - dist/radius), dy * strength * (1 - dist/radius));
                })
            );

            // Pull bullets
            Groups.bullet.intersect(
                this.x - radius,
                this.y - radius,
                radius*2,
                radius*2,
                cons(b => {
                    if(!b) return;
                    let dx = this.x - b.x;
                    let dy = this.y - b.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;
                    dx /= dist; dy /= dist;
                    let force = strength * (1 - dist/radius);
                    b.x += dx * force;
                    b.y += dy * force;
                    if(dist < 20) b.remove(); // destroy if too close
                })
            );
        };
    }

    // Attach to all existing blackholes
    Groups.unit.each(cons(u => {
        if(u.type === blackholeType) attachPull(u);
    }));

    // Attach to newly spawned blackholes
    Events.on(UnitCreateEvent, cons(e => {
        if(e.unit.type === blackholeType) attachPull(e.unit);
    }));

    print("BLACKHOLE SCRIPT READY");
}

// Run immediately if world already loaded, else wait for load
if(Vars.world != null){
    setupBlackhole();
} else {
    Events.on(WorldLoadEvent, cons(() => setupBlackhole()));
}