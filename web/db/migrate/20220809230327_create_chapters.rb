class CreateChapters < ActiveRecord::Migration[7.0]
  def change
    create_table :chapters do |t|
      t.belongs_to :publication, index: true, foreign_key: true
      t.string :title
      t.integer :chapter
      t.string :ipfs_nft_token_uri
      t.datetime :release_date

      t.timestamps
    end
  end
end
