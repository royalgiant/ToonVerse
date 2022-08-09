class CreatePublications < ActiveRecord::Migration[7.0]
  def change
    create_table :publications do |t|
      t.belongs_to :user, index: true, foreign_key: true
      t.string :title
      t.string :author
      t.string :day
      t.integer :recurrence
      t.integer :views
      t.integer :likes
      t.float :rating
      t.text :description
      t.string :category

      t.timestamps
    end
  end
end
