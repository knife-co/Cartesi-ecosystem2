const { ethers } = require("ethers");
const fetch = require("node-fetch");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;

function hex2str(hex) {
    return ethers.toUtf8String(hex);
}

function str2hex(payload) {
    return ethers.hexlify(ethers.toUtf8Bytes(payload));
}

let contacts = [];

async function handle_advance(data) {
    console.log("Received advance request data " + JSON.stringify(data));

    const payload = hex2str(data["payload"]);
    const action = JSON.parse(payload);

    if (action.type === "add") {
        contacts.push({ name: action.name, phone: action.phone });
        console.log(`Contact added: ${action.name} - ${action.phone}`);
    } else if (action.type === "remove") {
        const contactIndex = contacts.findIndex(c => c.name === action.name);
        if (contactIndex !== -1) {
            contacts.splice(contactIndex, 1);
            console.log(`Contact removed: ${action.name}`);
        } else {
            console.log(`Contact not found: ${action.name}`);
        }
    }

    await fetch(rollup_server + "/notice", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: str2hex(`Action processed: ${action.type}`) }),
    });

    return "accept";
}

async function handle_inspect(data) {
    console.log("Received inspect request data " + JSON.stringify(data));

    const payload = hex2str(data["payload"]);
    const route = payload;

    let responseObject;
    if (route === "list") {
        responseObject = JSON.stringify({ contacts });
    } else {
        responseObject = "route not implemented";
    }

    await fetch(rollup_server + "/report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: str2hex(responseObject) }),
    });

    return "accept";
}

var handlers = {
    advance_state: handle_advance,
    inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
    while (true) {
        const finish_req = await fetch(rollup_server + "/finish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "accept" }),
        });

        console.log("Received finish status " + finish_req.status);

        if (finish_req.status == 202) {
            console.log("No pending rollup request, trying again");
        } else {
            const rollup_req = await finish_req.json();
            var handler = handlers[rollup_req["request_type"]];
            finish["status"] = await handler(rollup_req["data"]);
        }
    }
})();