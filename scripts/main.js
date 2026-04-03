const blackhole = Vars.content.getByName(
    ContentType.unit,
    "apolotus-miniBlackhole"
);

print("SCRIPT LOADED: " + blackhole);

Events.on(UnitCreateEvent, cons(e => {

    if(e.unit.type == blackhole){

        print("BLACKHOLE SPAWNED");

        e.unit.update = function(){
            this.super$update();

            print("BLACKHOLE RUNNING");

            let radius = 340;
            let strength = 4.8;

            // 🟣 BULLETS
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

            // 🔵 UNITS
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