/* eslint-disable prettier/prettier */
exports.up = (pgm) => {
    pgm.createType("status", ["open", "closed"]);

    pgm.createTable("organization", {
        id_organization: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        id_users: {
            type: "VARCHAR(50)",
            references: "auth(id)",
            onDelete: "CASCADE",
        },
        organization_name: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        organization_desc: {
            type: "TEXT",
            notNull: true,
        },
        token_kelas: {
            type: "TEXT",
            notNull: true,
        },
        status: {
            type: "status",
            notNull: true,
        },
        created_at: {
            type: "VARCHAR(30)",
            notNull: true,
        },
        updated_at: {
            type: "VARCHAR(30)",
            notNull: true,
        },
        image_url: {
            type: "TEXT",
            notNull: false
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable("organization");

    pgm.dropType("status");
};
