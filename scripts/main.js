print("SCRIPT STARTED");

const blackhole = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");

if(!blackhole){
    print("❌ BLACKHOLE NOT FOUND");
} else {
    print("BLACKHOLE TYPE FOUND: " + blackhole);

    // override update for all instances
    blackhole.update = function(unit){
        this.super$update();

        print("🔥 BLACKHOLE UPDATE RUNNING");

        let radius = 340;
        let strength = 10;

        // pull units
        Groups.unit.intersect(
            unit.x - radius,
            unit.y - radius,
            radius * 2,
            radius * 2,
            cons(u => {
                if(u == unit) return;

                let dx = unit.x - u.x;
                let dy = unit.y - u.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 1) return;

                dx /= dist;
                dy /= dist;

                u.vel.add(dx * strength * (1 - dist / radius), dy * strength * (1 - dist / radius));
            })
        );

        // pull bullets (direct move)
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
                b.x += dx * force;
                b.y += dy * force;
            })
        );
    };
}