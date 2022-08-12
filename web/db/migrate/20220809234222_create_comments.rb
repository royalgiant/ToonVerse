class CreateComments < ActiveRecord::Migration[7.0]
  def change
    create_table :comments do |t|
      t.belongs_to :chapter, foreign_key: true
      t.belongs_to :user, foreign_key: true
      t.text :comment, null: false
      t.integer :report
      t.integer :likes
      t.integer :dislikes

      t.timestamps
    end
  end
end
