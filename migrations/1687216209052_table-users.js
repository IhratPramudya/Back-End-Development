/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    display_name: {
      type: "VARCHAR(50)",
    },
    user_desc: {
      type: "TEXT",
    },
    phone_number: {
      type: "VARCHAR(30)",
    },
    birthday: {
      type: "VARCHAR(30)",
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
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("users");
};
