/* eslint-disable prettier/prettier */
exports.up = (pgm) => {

    pgm.createTable("collab_organization", {
        id_colab: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        id_users: {
            type: "VARCHAR(50)",
            references: "auth(id)",
            onDelete: "CASCADE",
        },
        id_organization: {
            type: "VARCHAR(50)",
            references: "organization(id_organization)",
            onDelete: "CASCADE",
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("collab_organization");
};
