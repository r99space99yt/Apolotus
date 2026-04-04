var GlitchFloor = extend(Floor, {});
GlitchFloor.region = Core.atlas.find("glitch_0");
GlitchFloor.frames = [
    Core.atlas.find("glitch_0"),
    Core.atlas.find("glitch_1"),
    Core.atlas.find("glitch_2")
];
GlitchFloor.frameSpeed = 5;
GlitchFloor.solid = false;

Vars.content.add(GlitchFloor);
print('Glitch floor loaded :)')