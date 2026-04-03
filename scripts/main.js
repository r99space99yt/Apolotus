const blackhole = Vars.content.getByName(
    ContentType.unit,
    "apolotus-miniBlackhole"
);

if(blackhole != null){

    const superUpdate = blackhole.update;

    blackhole.update = function(unit){
        superUpdate(unit);

        let radius = 220;      // MUCH bigger range
        let strength = 0.6;    // stronger pull

        Groups.bullet.intersect(
            unit.x - radius,
            unit.y - radius,
            radius * 2,
            radius * 2,
            cons(b => {

                if(b.team == unit.team) return;

                let dx = unit.x - b.x;
                let dy = unit.y - b.y;
                let dist = Math.sqrt(dx*dx + dy*dy);

                if(dist < 1) return;

                dx /= dist;
                dy /= dist;

                let force = strength * (1 - dist / radius);

                b.vel.add(dx * force, dy * force);

                let angle = Mathf.angle(dx, dy) + 90;
                Tmp.v1.trns(angle, 0.25 * (1 - dist / radius));
                b.vel.add(Tmp.v1);

                if(dist < 25){
                    b.remove();
                    Effects.effect(Fx.absorb, b.x, b.y);
                }
            })
        );
    };
}