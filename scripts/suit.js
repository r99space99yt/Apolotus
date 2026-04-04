print("SUIT SCRIPT LOADED");

function initSuitScript(){
    print("SUIT SCRIPT STARTED");

    var shieldName = "apolotus-ShieldBlock";
    var maxHP = 950;
    var ticksToDestroy = 25*60; // 25s at 60 ticks
    var damagePerTick = maxHP / ticksToDestroy;
    var blackholeRadius = 300;

    Time.runTask(0, function suitLoop(){
        Groups.unit.each(cons(function(u){
            if(!u.carry || !u.carry.item) return;
            if(u.carry.item.name !== shieldName) return;

            if(u.shieldHP === undefined) u.shieldHP = maxHP;

            var nearBlackhole = false;

            Groups.unit.intersect(
                u.x - blackholeRadius, u.y - blackholeRadius,
                blackholeRadius*2, blackholeRadius*2,
                cons(function(bh){
                    if(bh && bh.type && bh.type.name === "apolotus-miniBlackhole") nearBlackhole = true;
                })
            );

            if(nearBlackhole){
                u.shieldHP -= damagePerTick;
                if(u.shieldHP <= 0){
                    u.shieldHP = 0;
                    u.carry = null;
                }
            }

            // Can't draw here directly, need Render event
            // Just store HP on unit for now
        }));

        Time.runTask(0, suitLoop);
    });

    print("SUIT SCRIPT READY");
}

// Safe init
try{
    initSuitScript();
}catch(e){
    print("Suit script error: "+e);
}