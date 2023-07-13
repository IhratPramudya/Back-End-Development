exports.up = (pgm) => {
  pgm.createTable("auth", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    id_users: {
      type: "VARCHAR(50)",
      references: "users(id)",
      onDelete: "CASCADE",
      unique: true,
    },
    username: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    password: {
      type: "TEXT",
      notNull: true,
    },
    fullname: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("auth");
};
