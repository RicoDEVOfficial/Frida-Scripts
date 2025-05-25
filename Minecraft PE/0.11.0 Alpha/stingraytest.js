// Minecraft Stingray Remake Script for use with Frida
// Made by RicoDEV

// for the github viewers, i am not lying, i made this, fully me
// since the .so was not obfuscated, i could get offsets easily

// this is a remake of the famous stingray thing in minevcraft, this will not give you the full experience since its 
// only a part of my remake which enables toast and changes world name

// first ever script for minecraft actually

var worldEnterCount = 0; // set counter to 0

function toast(toastText) { 
    Java.perform(function() { 
        var context = Java.use('android.app.ActivityThread').currentApplication().getApplicationContext();
        Java.scheduleOnMainThread(function() {
                var toast = Java.use("android.widget.Toast");
                toast.makeText(context, Java.use("java.lang.String").$new(toastText), 1).show();
        });
    });
}

// Initial toast when script starts
toast(" Stingray مانرای Remake \n Version: v4.5 b1 \n Made by RicoDEV");

var getLevelDataAddr = Module.findBaseAddress("libminecraftpe.so").add(0x268248);
console.log("[+] Hooking Level::getLevelData at", getLevelDataAddr);

Interceptor.attach(getLevelDataAddr, {
    onEnter: function (args) {
        worldEnterCount++;
        console.log("[*] World enter count:", worldEnterCount);
    },
    onLeave: function (retval) {
        if (worldEnterCount >= 3) {
            try {
                var levelDataPtr = retval;
                var nameFieldOffset = 0x10;
                var namePtr = Memory.readPointer(levelDataPtr.add(nameFieldOffset));
                var newName = Memory.allocUtf8String("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                Memory.writePointer(levelDataPtr.add(nameFieldOffset), newName);
                console.warn("[!] Level name forcibly changed to: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                
                // toast for debugging if smth gets broken
                toast("Level Change Triggered!");
            } catch (err) {
                console.error("Error while writing level name:", err);
            }
        }
    }
});
