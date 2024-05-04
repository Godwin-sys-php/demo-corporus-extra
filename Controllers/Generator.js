const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const Sessions = require("../Models/Sessions");
const SessionItems = require("../Models/SessionItems");

require("dotenv").config();

module.exports = async (req, res) => {
  try {
    console.log("hey");
    const number = req._session.id;
    const items = await Sessions.customQuery(
      "SELECT * FROM sessionItems WHERE sessionId = ?",
      [number]
    );
    const now = moment().utcOffset(1);
    const data = {
      data: {
        number: number,
        date: now.format("DD/MM/yyyy"),
        hours: now.format("H:mm"),
        client: req._session.clientName,
        nameOfServer: req._session.serverName,
        item: items,
        total: req._session.total,
        reduction: req._session.reduction,
        totalGeneral:
          Number(req._session.total) - Number(req._session.reduction),
        payed: Number(req._session.total) - Number(req._session.reduction),
        imgPath: path.join(__dirname, "../Assets/", "logo.png"),
      },
    };
    console.log("hey2");
    const nameOfTemplate = "bill.ejs";
    ejs.renderFile(
      path.join(__dirname, "../Assets/", nameOfTemplate),
      data,
      (err, data) => {
        console.log("hey3");
        if (err) {
          console.log(err);
        } else {
          console.log("hey4");
          let options = {
            childProcessOptions: {
              env: {
                OPENSSL_CONF: "/dev/null",
              },
            },
            width: "7.5cm",
            localUrlAccess: true,
          };
          console.log("hey5");
          const nameOfFile = `Facture_${number}_${req._session.clientName}.pdf`;
          console.log(nameOfFile);
          pdf
            .create(data, options)
            .toFile(`Invoices/${nameOfFile}`, async (err, data) => {
              console.log("hey6");
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({
                    error: true,
                    message: "Une erreur inconnue a eu lieu",
                  });
              }
              console.log("hey7");
              await Sessions.update({ invoice: nameOfFile }, { id: number });

              const sessions = await Sessions.customQuery(
                "SELECT * FROM sessions WHERE isDone = 0 OR isPaid = 0",
                []
              );
              const session = await Sessions.find({ id: req.params.id });
              const items = await SessionItems.customQuery(
                "SELECT * FROM sessionItems WHERE sessionId = ?",
                [req.params.id]
              );

              req.app
                .get("socketService")
                .broadcastEmiter(
                  JSON.stringify({
                    id: req.params.id,
                    session: session,
                    items: items,
                  }),
                  "edit-session"
                );

              return res
                .status(200)
                .json({
                  success: true,
                  message: "Facture générée",
                  sessions,
                  session: session[0],
                  items,
                });
            });
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};
