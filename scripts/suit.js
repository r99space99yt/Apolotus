print("SUIT SCRIPT LOADING");

(function(){

    const shieldName = "apolotus-ShieldBlock";
    const maxHP = 950;
    const ticksToBreak = 25 * 60; // 25 seconds at 60 ticks/sec
    const damagePerTick = maxHP / ticksToBreak;
    const blackholeRadius = 300;

    // Store shield HP per player safely
    const shieldHP = new Map();

    // Main loop
    Time.runTask(0, function suitLoop(){

        Groups.player.each(cons(p => {
            if(!p) return;

            // Get shield block carried
            let blockItem = null;
            try {
                if(p.payload && p.payload.item && p.payload.item.name === shieldName) blockItem = p.payload.item;
                else if(p.carry && p.carry.item && p.carry.item.name === shieldName) blockItem = p.carry.item;
            } catch(e){}

            if(!blockItem) {
                shieldHP.delete(p); // reset if no shield
                return;
            }

            // Initialize HP if missing
            if(!shieldHP.has(p)) shieldHP.set(p, maxHP);

            // Check for nearby blackholes
            let nearBlackhole = false;
            try {
                Groups.unit.intersect(
                    p.x - blackholeRadius, p.y - blackholeRadius,
                    blackholeRadius*2, blackholeRadius*2,
                    cons(u => {
                        if(u.type && u.type.name === "apolotus-miniBlackhole") nearBlackhole = true;
                    })
                );
            } catch(e){}

            // Damage shield if near blackhole
            if(nearBlackhole){
                let hp = shieldHP.get(p) - damagePerTick;
                if(hp <= 0){
                    hp = 0;
                    p.carry = null;
                    p.payload = null;
                    shieldHP.delete(p);
                } else {
                    shieldHP.set(p, hp);
                }
            }

            // Simple HP UI below player
            try {
                const hp = Math.floor(shieldHP.get(p) || 0);
                p.name = "Shield HP: " + hp;
            } catch(e){}
        }));

        Time.runTask(0, suitLoop);
    });

    print("SUIT SCRIPT READY");

})();