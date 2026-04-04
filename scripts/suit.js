print("SUIT SCRIPT LOADED");

function initSuitScript() {
    print("SUIT SCRIPT STARTED");

    const shieldName = "apolotus-ShieldBlock";
    const maxHP = 950;
    const ticksToDestroy = 25 * 60; // 25 seconds at 60 ticks/sec
    const damagePerTick = maxHP / ticksToDestroy;
    const blackholeRadius = 300;

    // Main suit loop
    Time.runTask(0, function suitLoop() {
        Groups.unit.each(cons(function(u) {
            // Only check units carrying the shield safely
            if(!u.carry || !u.carry.item) return;
            if(u.carry.item.name !== shieldName) return;

            // Initialize HP if missing
            if(u.shieldHP === undefined) u.shieldHP = maxHP;

            var nearBlackhole = false;

            // Detect blackholes near the unit
            Groups.unit.intersect(
                u.x - blackholeRadius, u.y - blackholeRadius,
                blackholeRadius * 2, blackholeRadius * 2,
                cons(function(bh) {
                    if(bh && bh.type && bh.type.name === "apolotus-miniBlackhole") nearBlackhole = true;
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

            // Draw HP below unit
            Draw.z(1000);
            Draw.color(Color.red);
            var hitSize = u.hitSize ? u.hitSize : 20;
            Draw.text(Math.floor(u.shieldHP) + " HP", u.x, u.y - hitSize - 10);
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