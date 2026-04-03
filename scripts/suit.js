print("SUIT SCRIPT LOADED");

function initSuitScript(){
    print("SUIT SCRIPT STARTED");

    const shieldName = "apolotus-ShieldBlock";
    const damagePerTick = 950 / (25 * 60); // 25 sec to destroy at 60 ticks/sec

    Time.runTask(0, function suitLoop(){
        Groups.unit.each(cons(u => {
            if(!u.carry || !u.carry.item || u.carry.item.name !== shieldName) return;

            let block = u.carry.item;
            let nearbyBlackhole = false;

            Groups.unit.intersect(
                u.x - 300, u.y - 300,
                600, 600,
                cons(bh => {
                    if(bh.type && bh.type.name === "apolotus-miniBlackhole") nearbyBlackhole = true;
                })
            );

            if(nearbyBlackhole){
                block.health = (block.health || 950) - damagePerTick;

                // Clamp
                if(block.health <= 0){
                    block.health = 0;
                    // Drop or destroy the suit
                    u.carry = null;
                }

                // Optional: show HP below player
                u.name = "HP: " + Math.floor(block.health);
            }
        }));

        Time.runTask(0, suitLoop);
    });

    print("SUIT SCRIPT READY");
}