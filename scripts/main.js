print("SCRIPT STARTED");

// Function to set up blackhole behavior
function setupBlackhole(){
    const blackhole = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");

    if(!blackhole){
        print("❌ BLACKHOLE NOT FOUND — check internal name!");
        return;
    }

    print("BLACKHOLE FOUND: " + blackhole);

    // Override update for all instances of this unit type
    blackhole.update = function(unit){
        this.super$update();

        // Debug print
        // print("🔥 BLACKHOLE UPDATE RUNNING"); // optional spam

        let radius = 400;    // pull radius
        let strength = 15;   // pull strength (tune to your liking)

        // Pull units
        Groups.unit.intersect(
            unit.x - radius,
            unit.y - radius,
            radius * 2,
            radius * 2,
            cons(u => {
                if(u == unit) return; // skip self

                let dx = unit.x - u.x;
                let dy = unit.y - u.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 1) return;

                dx /= dist;
                dy /= dist;

                // add pull velocity
                u.vel.add(dx * strength * (1 - dist / radius), dy * strength * (1 - dist / radius));
            })
        );

        // Pull bullets
        Groups.bullet.intersect(
            unit.x - radius,
            unit.y - radius,
            radius * 2,
            radius * 2,
            cons(b => {
                let dx = unit.x - b.x;
                let dy = unit.y - b.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 1) return;

                dx /= dist;
                dy /= dist;

                let force = strength * (1 - dist / radius);

                // Move bullet directly (more reliable in build 156)
                b.x += dx * force;
                b.y += dy * force;

                // Destroy bullets too close to blackhole center
                if(dist < 20){
                    b.remove();
                }
            })
        );
    };
}

// Check if world is already loaded
if(Vars.world != null){
    setupBlackhole(); // world already loaded
} else {
    Events.on(WorldLoadEvent, cons(() => setupBlackhole())); // wait for world
}

print("BLACKHOLE SCRIPT READY");