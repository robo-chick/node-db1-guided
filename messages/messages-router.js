const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
    try {
        // translates to SELECT * FROM messages;
        const messages = await db.select("*").from("messages")

        res.json(messages)
    } catch (err) {
        next(err)
    }
})

router.get("/:id", async (req, res, next) => {
    // translates to SELECT * FROM messages WHERE id = ?;
    try {
        const [message] = await db
            .select("*")
            .from("messages")
            .where("id", req.params.id)
            .limit(1)

        res.json(message)
    } catch (err) {
        next(err)
    }
})

router.post("/", async (req, res, next) => {
    // translates to INSERT INTO messages (title, contents) VALUES (?, ?);
    try {
        const [id] = await db
            .insert({
                // database will automatically generate the ID
                title: req.body.title,
                contents: req.body.contents,
            })
            .into("messages")

        // translates to SELECT * FROM messages WHERE id = ? LIMIT 1
        const message = await db("messages")
            .where("id", id)
            .first

        res.status(201).json(message)
    } catch (err) {
        next(err)
    }

})

router.put("/:id", async (req, res, next) => {
    try {
        // translates to UPDATE messages SET title = ? AND content = > WHERE id = ?
        await db("messages")
            .update({
                title: req.body.title,
                contents: req.body.contents,
            })
            .where("id", req.params.id)

        // translates to SELECT * FROM messages WHERE id = ? LIMIT 1;
        const message = await db("messages")
            .where("id", req.params.id)
            .first()

        res.json(message)
    } catch (err) {
        next(err)
    }
})

router.delete("/:id", async (req, res, next) => {
    try {
        // translates to DELETE FROM messages WHERE id = ?
    await db("messages")
    .where("id", req.params.id)
    .del()

    // since we no longer have aresource to return, just send a 204
    // which means "success, but no response data is being sent"

    res.status(204).end()
    } catch(err) {
        next(err)
    }
})

module.exports = router