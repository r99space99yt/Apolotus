print("SUIT SCRIPT LOADED");

function initSuitScript() {
    print("SUIT SCRIPT STARTED");

    const shieldName = "apolotus-ShieldBlock";
    const maxHP = 950;
    const ticksToDestroy = 25 * 60; // 25 seconds at 60 ticks/sec
    const damagePerTick = maxHP / ticksToDestroy;
    const blackholeRadius = 300;

    // Assign shield HP when picked up
    Groups.unit.each(cons(u => {
        if(u.carry?.item?.name === shieldName && u.shieldHP === undefined){
            u.shieldHP = maxHP;
        }
    }));

    // Main suit loop
    Time.runTask(0, function suitLoop() {
        Groups.unit.each(cons(u => {
            // Only check units carrying the shield
            if(!u.carry || !u.carry.item || u.carry.item.name !== shieldName) return;

            // Initialize HP if missing
            if(u.shieldHP === undefined) u.shieldHP = maxHP;

            let nearBlackhole = false;

            // Detect blackholes near the unit
            Groups.unit.intersect(
                u.x - blackholeRadius, u.y - blackholeRadius,
                blackholeRadius * 2, blackholeRadius * 2,
                cons(bh => {
                    if(bh.type && bh.type.name === "apolotus-miniBlackhole") nearBlackhole = true;
                })
            );

            // Apply damage over time
            if(nearBlackhole){
                u.shieldHP -= damagePerTick;
                if(u.shieldHP <= 0){
                    u.shieldHP = 0;
                    u.carry = null; // destroy the shield
                }
            }

            // Optional: show HP below the unit
            // Draw in-place to avoid RenderEvent issues
            Draw.z(1000);
            Draw.color(Color.red);
            Draw.text(Math.floor(u.shieldHP) + " HP", u.x, u.y - (u.hitSize || 20) - 10);
        }));

        Time.runTask(0, suitLoop);
    });

    print("SUIT SCRIPT READY");
}

// Safe initialization
try {
    initSuitScript();
} catch(e){
    print("Error initializing suit script: " + e);
}