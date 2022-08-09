class CreateComments < ActiveRecord::Migration[7.0]
  def change
    create_table :comments do |t|
      t.belongs_to :chapter, foreign_key: true
      t.belongs_to :user, foreign_key: true

      t.timestamps
    end
  end
end
