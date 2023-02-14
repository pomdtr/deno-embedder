/// <reference lib="dom"/>

// Can import both local and remote code. 
// Remote code will be cached and bundled so that it can be served locally w/o
// any network requests.
import sarcasm from "./sarcasm.ts"
import confetti from "https://esm.sh/canvas-confetti@1.6.0"



export function run() {
    document.body.onclick = onClick
    onClick()
}

function onClick() {
    const firstH1 = document.querySelector("h1")
    if (firstH1 == null) {
        console.warn("Couldn't find an H1 to update")
    } else {
        firstH1.innerText = sarcasm(firstH1.innerText)
    }

    confetti()
}