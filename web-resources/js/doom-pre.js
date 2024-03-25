Module['noInitialRun'] = true;


Module['onRuntimeInitialized'] = function(target_elf) {
    if(target_elf === undefined)
      return;

    //Module['arguments'] = []
    //Module['arguments'].push(target_elf);

    //run(Module['arguments']);
    console.log(target_elf);
    callMain([target_elf]);
    //callMain();
};
