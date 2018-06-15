// version 0
function processes(arg) {
  if (arg != null) {
    let resultA = processA(arg);
    if (resultA != null) {
      let resultB = processB(resultA);
      if (resultB != null) {
        let resultC = processC(resultB);
        return resultC
      }
    }
  }
  throw new Error("result is null !!")
}

// analyze version 0
function processes(arg) {
  //
  if (arg != null) {
    let resultA = processA(arg);
    //
    if (resultA != null) {
      let resultB = processB(resultA);
      //
      if (resultB != null) {
        let resultC = processC(resultB);

        return resultC
      }
    }
  }
  throw new Error("result is null!!")
}
// points:
//   * if arguments is "null", skip the process and funally throw error

// version 1
function safeProcessA(arg) {
  if (arg == null) {
    return null
  } else {
    return processA(arg)
  }
}

function safeProcessB(arg) {
  if (arg == null) {
    return null
  } else {
    return processB(arg)
  }
}
// processC is same as processA & B

function process(arg) {
  let resultA = safeProcessA(arg);
  let resultB = safeProcessB(resultA);
  let resultC = safeProcessC(resultB);
  if (resultC != null) {
    return resultC
  } else /* resultC == null */ {
    throw new Error("result is null!!")
  }
}
// skipping process by "return null"
// process looks slim, but safeProcessX is fat, so total amount of cade do not change.
// safeProcessX have "same structure" == "patern"

// version 2
function makeSafe(arg, func) {
  if (arg == null) {
    return null
  } else {
    return func(arg)
  }
}

function process(arg) {
  let resultA = makeSafe(arg, processA);
  let resultB = makeSafe(resultA, processB);
  let resultC = makeSafe(resultB, processC);
  if (resultC != null) {
    return resultC
  } else /* resultC == null */ {
    throw new Error("result is null!!")
  }
}
// slim!! good!! but, it also has the pattern, "repeating makeSafe()"
// common: makeSafe(arg,)
// arg is value, and if value itself has the null check...?

// version 3
class SuperValue {
  contructor(value) {
    this.value = value;
  }
  map(func) { // ~ makeSafe(func)
    if (this.value == null) {
      // skip func
      return this // return wrapped "null"
    } else {
      let result = func(this.value);
      return new SuperValue(result); // retrun wrapped "f(args)"
    }
  }
}

function process(arg) {
  let superArg = new SuperValue(arg);
  let resultA = superArg.map(processA);
  let resultB = resultA.map(processB);
  let resultC = resultB.map(processC);
  if (resultC.value != null) {
    return resultC
  } else /* resultC.value == null */ {
    throw new Error("result is null!!")
  }
}
// total amount seems not to be affected, it has good side effect

// version 3.0.1
function process(arg) {
  let superArg = new SuperValue(arg);
  let result = superArg.map(processA).map(processB).map(processC); // successive function map
  if (result.value != null) {
    return result
  } else /* resultC.value == null */ {
    throw new Error("result is null!!")
  }
}
// enabling delete temporal variables!!! cool!!
// ofcourse, version2 also can "temporal variables deletion", but it is too complicated.
// version 2.0.1
function process(arg) {
  let resultC = makeSafe(makeSafe(makeSafe(arg, processA), processB), processC);
  if (resultC != null) {
    return resultC
  } else /* resultC == null */ {
    throw new Error("result is null!!")
  }
}
// ....????

// version 4??
function process(arg) {
  let superArg = new SuperValue(arg);
  let fullProcess = R.pipeK(
    processA,
    processB,
    processC
  );
  let result = fullProcess(superArg);
  if (result.value != null) {
    return result
  } else /* resultC.value == null */ {
    throw new Error("result is null!!")
  }
}

// version 5 ??
const fullProcess = (arg) => R.pipeK(
  SuperValue.of,
  processA,
  processB,
  processC
)(arg).value();
// or
function process(arg) {
  const fullProcess = R.pipeK(SuperValue.of, processA, processB, processC);
  return fullProcess(arg).value();
}
