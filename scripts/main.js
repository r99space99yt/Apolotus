// =========================
// ✅ BASIC LOAD CHECK
// =========================
print("SCRIPT STARTED");

// =========================
// ✅ WAIT FOR GAME LOAD
// =========================
Events.on(ClientLoadEvent, cons(() => {

    print("CLIENT LOADED");

    // =========================
    // ✅ GET UNIT AFTER LOAD
    // =========================
    const blackhole = Vars.content.getByName(
        ContentType.unit,
        "apolotus-miniBlackhole"
    );

    print("BLACKHOLE TYPE: " + blackhole);

    if(blackhole == null){
        print("❌ BLACKHOLE NOT FOUND");
        return;
    }

    // =========================
    // ✅ HOOK UNIT SPAWN
    // =========================
    Events.on(UnitCreateEvent, cons(e => {

        if(e.unit.type == blackhole){

            print("🔥 BLACKHOLE SPAWNED");

            // =========================
            // ✅ OVERRIDE UPDATE LOOP
            // =========================
            e.unit.update = function(){
                this.super$update();

                // DEBUG (you can remove later)
                // print("RUNNING");

                let radius = 340;
                let strength = 4.8;

                // =========================
                // 🟣 BULLETS
                // =========================
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

                // =========================
                // 🔵 UNITS
                // =========================
                Groups.unit.intersect(
                    this.x - radius,
                    this.y - radius,
                    radius * 2,
                    radius * 2,
                    cons(u => {

                        let dx = this.x - u.x;
                        let dy = this.y - u.y;
                        let dist = Math.sqrt(dx*dx + dy*dy);

                        if(dist < 1) return;

                        dx /= dist;
                        dy /= dist;

                        let force = 5.0 * (1 - dist / radius);

                        u.vel.add(dx * force, dy * force);
                    })
                );
            };
        }
    }));
}));