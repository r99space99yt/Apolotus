print("SCRIPT STARTED");

Events.on(WorldLoadEvent, cons(() => {
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        print("❌ BLACKHOLE NOT FOUND");
        return;
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType);

    // Run for every blackhole unit spawned
    Events.on(UnitCreateEvent, cons(e => {
        if(e.unit.type != blackholeType) return;

        let unit = e.unit;

        // Save original update
        let oldUpdate = unit.update;

        // Override update safely on this instance
        unit.update = function(){
            oldUpdate.call(this); // call original

            let radius = 200;
            let strength = 5;

            // Pull units safely
            Groups.unit.intersect(
                this.x - radius,
                this.y - radius,
                radius*2,
                radius*2,
                cons(u => {
                    if(!u || u.dead || u.isPlayer() || u === this) return; // skip self

                    let dx = this.x - u.x;
                    let dy = this.y - u.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;

                    dx /= dist;
                    dy /= dist;

                    u.vel.add(dx*strength*(1-dist/radius), dy*strength*(1-dist/radius));
                })
            );

            // Pull bullets safely
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

                    dx /= dist;
                    dy /= dist;

                    let force = strength*(1-dist/radius);
                    b.x += dx*force;
                    b.y += dy*force;

                    if(dist < 20) b.remove();
                })
            );
        };
    }));
}));