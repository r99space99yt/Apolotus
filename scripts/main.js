Events.on(WorldLoadEvent, cons(() => {
    const blackholeType = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackholeType){
        print("❌ BLACKHOLE NOT FOUND");
        return;
    }

    print("BLACKHOLE TYPE FOUND: " + blackholeType);

    function attach(unit){
        if(unit.blackholeAttached) return;
        unit.blackholeAttached = true;

        const oldUpdate = unit.update;
        unit.update = function(){
            oldUpdate.call(this);

            let radius = 300;
            let unitStrength = 50;    // for units
            let bulletStrength = 600; // for bullets

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
                    u.vel.add(dx*unitStrength*(1-dist/radius), dy*unitStrength*(1-dist/radius));
                })
            );

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
                    b.x += dx * bulletStrength * (1 - dist/radius);
                    b.y += dy * bulletStrength * (1 - dist/radius);
                    if(dist < 20) b.remove();
                })
            );
        };
    }

    Groups.unit.each(cons(u => { if(u.type === blackholeType) attach(u); }));
    Events.on(UnitCreateEvent, cons(e => { if(e.unit.type === blackholeType) attach(e.unit); }));

    print("BLACKHOLE SCRIPT READY");
}));