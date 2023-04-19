module.exports = () => {
    const axios = require('axios');
    const fs = require('fs');
    const YAML = require('yaml');
    const config = YAML.parse(fs.readFileSync("./config.yaml").toString());

    const last = parseInt(fs.readFileSync("./last.txt").toString().trim());
    const current = JSON.parse(fs.readFileSync("./output.json").toString()).total;

    function formatPonypush(text) {
        return "Update to Ponypush 3.1.0 or later — ($PA1$$" + Buffer.from(text).toString("base64") + "$$)";
    }

    console.log(last, current);

    if (last !== current) {
        switch (current) {
            case 0:
                (async () => {
                    await axios.post(config['ntfy']['server'], {
                        topic: config['ntfy']['topic'],
                        message: formatPonypush('The current outage is now over and everything is working as expected.'),
                        title: formatPonypush("✅ All systems operational"),
                        priority: 3,
                        tags: ['status'],
                        click: "https://status.equestria.dev",
                        actions: [
                            {
                                action: "view",
                                label: "View status page",
                                url: "https://status.equestria.dev",
                                clear: true
                            },
                            {
                                action: "view",
                                label: "Open Proxmox",
                                url: "https://admin.equestria.dev",
                                clear: true
                            }
                        ]
                    }, {
                        auth: {
                            username: config['ntfy']['user'],
                            password: config['ntfy']['password']
                        }
                    })
                })();
                break;
            case 1:
                (async () => {
                    await axios.post(config['ntfy']['server'], {
                        topic: config['ntfy']['topic'],
                        message: formatPonypush('One or more service(s) is/are experiencing temporary performance degradation, this is most likely safe.'),
                        title: formatPonypush("⚠️ Service is disturbed"),
                        priority: 3,
                        tags: ['status'],
                        click: "https://status.equestria.dev",
                        actions: [
                            {
                                action: "view",
                                label: "View status page",
                                url: "https://status.equestria.dev",
                                clear: true
                            },
                            {
                                action: "view",
                                label: "Open Proxmox",
                                url: "https://admin.equestria.dev",
                                clear: true
                            }
                        ]
                    }, {
                        auth: {
                            username: config['ntfy']['user'],
                            password: config['ntfy']['password']
                        }
                    })
                })();
                break;
            case 2:
                (async () => {
                    await axios.post(config['ntfy']['server'], {
                        topic: config['ntfy']['topic'],
                        message: formatPonypush('One or more service(s) is/are experiencing a major outage, investigation is needed.'),
                        title: formatPonypush("🚨 Major outage"),
                        priority: 3,
                        tags: ['status'],
                        click: "https://status.equestria.dev",
                        actions: [
                            {
                                action: "view",
                                label: "View status page",
                                url: "https://status.equestria.dev",
                                clear: true
                            },
                            {
                                action: "view",
                                label: "Open Proxmox",
                                url: "https://admin.equestria.dev",
                                clear: true
                            }
                        ]
                    }, {
                        auth: {
                            username: config['ntfy']['user'],
                            password: config['ntfy']['password']
                        }
                    })
                })();
                break;
        }

        fs.writeFileSync("./last.txt", current.toString());
    }
}