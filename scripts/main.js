// get your unit (modname + unit name)
const blackhole = Vars.content.getByName(
    ContentType.unit,
    "apolotus-miniBlackhole"
);

if(blackhole != null){
        print("BLACKHOLE ACTIVE");

    // override unit instance (IMPORTANT for build 156)
    blackhole.constructor = () => {
        const unit = new UnitEntity();

        unit.update = function(){
            this.super$update();

            let radius = 340;     // size of blackhole
            let strength = 4.8;   // base gravity strength
            print("BLACKHOLE RUNNING, BRO, IF U SEE THIS, MIND ME, CONSOLEEEE");
            // ======================
            // 🟣 BULLET GRAVITY
            // ======================
            Groups.bullet.intersect(
                this.x - radius,
                this.y - radius,
                radius * 2,
                radius * 2,
                cons(b => {

                    if(b.team == this.team) return;

                    let dx = this.x - b.x;
                    let dy = this.y - b.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);

                    if(dist < 1) return;

                    dx /= dist;
                    dy /= dist;

                    let force = strength * (1 - dist / radius);

                    // 💥 redirect velocity (smooth gravity)
                    b.vel.lerp(
                        Tmp.v1.set(dx, dy).scl(b.vel.len()),
                        0.08 + force * 0.1
                    );

                    // 🌀 spiral motion
                    Tmp.v2.trns(Mathf.angle(dx, dy) + 90, force * 0.5);
                    b.vel.add(Tmp.v2);

                    // 💀 absorb bullets
                    if(dist < 20){
                        b.remove();
                        Effects.effect(Fx.absorb, b.x, b.y);
                    }
                })
            );

            // ======================
            // 🔵 UNIT GRAVITY
            // ======================
            Groups.unit.intersect(
                this.x - radius,
                this.y - radius,
                radius * 2,
                radius * 2,
                cons(u => {

                    if(u.team == this.team) return;

                    let dx = this.x - u.x;
                    let dy = this.y - u.y;
                    let dist = Math.sqrt(dx*dx + dy*dy);

                    if(dist < 1) return;

                    dx /= dist;
                    dy /= dist;

                    let force = 5.0 * (1 - dist / radius);

                    // 💥 redirect movement (feels like gravity)
                    u.vel.lerp(
                        Tmp.v1.set(dx, dy).scl(u.vel.len() + 0.5),
                        0.05 + force * 0.08
                    );

                    // 🌀 swirl
                    Tmp.v2.trns(Mathf.angle(dx, dy) + 90, force * 0.6);
                    u.vel.add(Tmp.v2);

                    // 💀 damage near center
                    if(dist < 25){
                        u.damage(50);
                    }
                })
            );

            // ======================
            // 🌌 VISUAL EFFECT (optional)
            // ======================
            if(Mathf.chance(0.3)){
                Effects.effect(Fx.smoke, this.x, this.y);
            }
        };

        return unit;
    };
}