print("SCRIPT STARTED");

Events.on(WorldLoadEvent, cons(() => {
    print("WORLD LOADED, waiting 5 seconds...");

    // Delay 5 seconds (300 ticks at 60 FPS)
    Time.run(300, () => {
        print("5 seconds passed — setting up blackhole");

        const blackhole = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");

        if(!blackhole){
            print("❌ BLACKHOLE NOT FOUND — check internal name!");
            return;
        }

        print("BLACKHOLE FOUND: " + blackhole);

        blackhole.update = function(unit){
            this.super$update();

            let radius = 200;    // safer radius
            let strength = 5;    // safer strength

            // pull units safely
            Groups.unit.intersect(
                unit.x - radius,
                unit.y - radius,
                radius * 2,
                radius * 2,
                cons(u => {
                    if(u == unit || u.dead) return;

                    let dx = unit.x - u.x;
                    let dy = unit.y - u.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 1) return;

                    dx /= dist;
                    dy /= dist;

                    u.vel.add(dx*strength*(1-dist/radius), dy*strength*(1-dist/radius));
                })
            );

            // pull bullets
            Groups.bullet.intersect(
                unit.x - radius,
                unit.y - radius,
                radius*2,
                radius*2,
                cons(b => {
                    let dx = unit.x - b.x;
                    let dy = unit.y - b.y;
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

        print("BLACKHOLE SCRIPT READY AFTER DELAY");
    });
}));