# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_08_09_230327) do
  create_table "chapters", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "publication_id"
    t.string "title"
    t.integer "chapter"
    t.string "ipfs_nft_token_uri"
    t.datetime "release_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["publication_id"], name: "index_chapters_on_publication_id"
  end

  create_table "follows", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "follower_id"
    t.integer "followed_user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "publications", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.string "author"
    t.string "day"
    t.integer "recurrence"
    t.integer "views"
    t.integer "likes"
    t.float "rating"
    t.text "description"
    t.string "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_publications_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "wallet_address"
    t.string "first_name"
    t.string "last_name"
    t.string "email"
    t.string "address1"
    t.string "address2"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "country"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "chapters", "publications"
  add_foreign_key "publications", "users"
end
