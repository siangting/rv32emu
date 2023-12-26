Module['noInitialRun'] = true;
Module['noExitRuntime'] = true; // need this?
Module['onRuntimeInitialized'] = function(target_elf) {
    if(target_elf === undefined)
      return;

    var opt_prog_name = stringToNewUTF8(`build/${target_elf}`);
    var elf = Module._elf_new();
    var file = Module._elf_open(elf, opt_prog_name);
    var end = Module._elf_get_symbol(elf, stringToNewUTF8("_end"));
    if(end){
      Module.setValue(state + 4, Module.getValue(end + 4), "i32");
    }

    var state = Module._state_new(64 * 128 * 1024);
    Module.setValue(state + 12, 0, "i32");
    Module.setValue(state + 16, 0, "i32");
    Module.setValue(state + 20, 0, "i8");
    Module.setValue(state + 21, 1, "i8");

    var rv = Module._rv_create(state);

    var mem = Module.getValue(state, "i8*");
    var elf_load_ret = Module._elf_load(elf, rv);
    if(!elf_load_ret) {
        console.log("elf load failed");
        return;
    }

    var cycle_per_step = 100;
    for(; !Module._rv_has_halted(rv);){
      Module._rv_step(rv,cycle_per_step);
    }

    Module._elf_delete(elf);
    Module._rv_delete(rv);
    Module._state_delete(state);
  };
