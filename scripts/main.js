print("SCRIPT STARTED");

Events.on(WorldLoadEvent, cons(() => {
    print("WORLD LOADED");

    const blackhole = Vars.content.getByName(
        ContentType.unit,
        "apolotus-miniBlackhole"
    );

    print("BLACKHOLE TYPE: " + blackhole);

    if(blackhole == null){
        print("❌ NOT FOUND");
        return;
    }

    Events.on(UnitCreateEvent, cons(e => {
        if(e.unit.type == blackhole){
            print("🔥 BLACKHOLE SPAWNED");

            e.unit.update = function(){
                this.super$update();

                let radius = 440;
                let strength = 160.0;

                // Pull units
                Groups.unit.intersect(
                    this.x - radius,
                    this.y - radius,
                    radius * 2,
                    radius * 2,
                    cons(u => {
                        if(u == this) return; // skip self

                        let dx = this.x - u.x;
                        let dy = this.y - u.y;
                        let dist = Math.sqrt(dx*dx + dy*dy);
                        if(dist < 1) return;

                        dx /= dist;
                        dy /= dist;

                        let force = strength * (1 - dist / radius);
                        u.vel.add(dx * force, dy * force);
                    })
                );

                // Pull bullets
                Groups.bullet.intersect(
                    this.x - radius,
                    this.y - radius,
                    radius * 2,
                    radius * 2,
                    cons(b => {
                        let dx = this.x - b.x;
                        let dy = this.y - b.y;
                        let dist = Math.sqrt(dx*dx + dy*dy);
                        if(dist < 1) return;

                        dx /= dist;
                        dy /= dist;

                        let force = strength * (1 - dist / radius);
                        b.vel.add(dx * force, dy * force);
                    })
                );
            };
        }
    }));
}));