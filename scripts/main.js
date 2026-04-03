print("SCRIPT STARTED");

function setupBlackholeSafe(){
    const blackhole = Vars.content.getByName(ContentType.unit, "apolotus-miniBlackhole");
    if(!blackhole){
        print("❌ BLACKHOLE NOT FOUND");
        return;
    }

    blackhole.update = function(unit){
        this.super$update();

        let radius = 200;
        let strength = 5;

        // Pull units safely
        Groups.unit.intersect(
            unit.x - radius,
            unit.y - radius,
            radius*2,
            radius*2,
            cons(u => {
                if(!u || u.dead || u.isPlayer()) return;

                let dx = unit.x - u.x;
                let dy = unit.y - u.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 1) return;

                dx /= dist;
                dy /= dist;

                u.vel.add(dx*strength*(1-dist/radius), dy*strength*(1-dist/radius));
            })
        );

        // Pull bullets safely
        Groups.bullet.intersect(
            unit.x - radius,
            unit.y - radius,
            radius*2,
            radius*2,
            cons(b => {
                if(!b) return;

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

    print("BLACKHOLE SCRIPT READY SAFELY");
}

// Wait until the world is fully ready
Events.on(WorldLoadEvent, cons(() => {
    Time.runTask(1, function checkReady(){
        if(Groups.unit.isEmpty() && Groups.bullet.isEmpty()){
            // world not fully loaded yet, check next tick
            Time.runTask(1, checkReady);
        } else {
            setupBlackholeSafe();
        }
    });
}));