package model

import (
	"database/sql"
	"errors"
	"strconv"
	"strings"

	"example.com/backend/config"
)

type Nodes struct {
	Id, Parent_id int
	Data          *string `json:"data" binding:"required"`
	Type          *string `json:"type" binding:"required"`

	Orden sql.NullString

	Done   sql.NullBool
	Lang   sql.NullString
	Number sql.NullInt16
	Ref_id sql.NullInt16
}
type ParentNodes struct {
	Id   int
	Data *string `json:"data" binding:"required"`
	Type *string `json:"type" binding:"required"`
}

var tableCreation = `
CREATE TABLE IF NOT EXISTS nodes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	parent_id INTEGER,
	data TEXT NOT NULL,
	type TEXT,
	orden TEXT,

	number INTEGER,
	done BOOLEAN DEFAULT FALSE,
	language TEXT,
	ref_id INTEGER,

	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(parent_id) REFERENCES nodes(id) ON DELETE CASCADE,
	FOREIGN KEY(ref_id) REFERENCES nodes(id) ON DELETE SET NULL
)
`

var migrationAddRefId = `ALTER TABLE nodes ADD COLUMN ref_id INTEGER`

func CreateTableNode() error {
	_, err := config.DB.Exec(tableCreation)
	if err != nil {
		return err
	}
	config.DB.Exec(migrationAddRefId)
	return nil
}

func GetParentNodes() ([]ParentNodes, error) {
	rows, err := config.DB.Query("SELECT id, data, type FROM nodes WHERE parent_id IS NULL")

	if err != nil {
		return nil, err
	}
	// if rows.Err() != nil {
	// 	return nil, rows.Err()
	// }

	var items []ParentNodes
	for rows.Next() {
		var parent ParentNodes
		if err := rows.Scan(&parent.Id, &parent.Data, &parent.Type); err != nil {
			return nil, err
		}
		items = append(items, parent)
	}
	return items, nil
}

type NodeName struct {
	Data *string
}

func GetNodeName(parentId string) ([]NodeName, error) {
	query := "SELECT data FROM nodes WHERE id = ?"
	rows, err := config.DB.Query(query, parentId)
	if err != nil {
		return nil, err
	}
	var items []NodeName
	for rows.Next() {
		var node NodeName
		if err := rows.Scan(&node.Data); err != nil {
			return nil, err
		}
		items = append(items, node)
	}
	return items, nil
}

func GetNodes(parentId string) ([]Nodes, error) {
	query := "SELECT id, type, data, done, language, orden, number, parent_id, ref_id FROM nodes WHERE parent_id = ?"
	rows, err := config.DB.Query(query, parentId)
	if err != nil {
		return nil, err
	}
	var items []Nodes

	for rows.Next() {
		var node Nodes
		err := rows.Scan(&node.Id, &node.Type, &node.Data, &node.Done, &node.Lang, &node.Orden, &node.Number, &node.Parent_id, &node.Ref_id)
		if err != nil {
			return nil, err
		}
		items = append(items, node)
	}
	return items, nil
}

type AddNodeType struct {
	Type  *string `json:"type" binding:"required"`
	Data  *string `json:"data" binding:"required"`
	Orden *string `json:"orden" binding:"required"`
	RefId *int    `json:"ref_id"`
}

func AddNode(id string, newNode AddNodeType) (int64, error) {
	insertSQL := `INSERT INTO nodes(data, type, orden, parent_id, ref_id) values(?, ?, ?, ?, ?);`
	var refId interface{} = nil
	if newNode.RefId != nil {
		refId = *newNode.RefId
	}
	result, err := config.DB.Exec(insertSQL, *newNode.Data, *newNode.Type, *newNode.Orden, id, refId)
	if err != nil {
		return 0, err
	}

	LastInserId, err := result.LastInsertId()

	return LastInserId, err
}

func AddParentNode(data string) (int64, error) {
	insertSQL := `insert into nodes(data, type, parent_id) values(?, "parent_node", NULL)`
	result, err := config.DB.Exec(insertSQL, data)
	if err != nil {
		return 0, err
	}

	return result.LastInsertId()
}

type UpdatedNode struct {
	Data, Type, Orden *string

	Done   *bool
	Number *int
	Lang   *string
	RefId  *int
}

func PartialNodeUpdate(id string, updates UpdatedNode) error {
	sets := []string{}
	args := []any{}

	if updates.Data != nil {
		sets = append(sets, "data = ?")
		args = append(args, *updates.Data)
	}
	if updates.Type != nil {
		sets = append(sets, "type = ?")
		args = append(args, *updates.Type)
	}
	if updates.Done != nil {
		sets = append(sets, "done = ?")
		args = append(args, *updates.Done)
	}
	if updates.Number != nil {
		sets = append(sets, "number = ?")
		args = append(args, *updates.Number)
	}
	if updates.Lang != nil {
		sets = append(sets, "language = ?")
		args = append(args, *updates.Lang)
	}
	if updates.Orden != nil {
		sets = append(sets, "orden = ?")
		args = append(args, *updates.Orden)
	}
	if updates.RefId != nil {
		sets = append(sets, "ref_id = ?")
		args = append(args, *updates.RefId)
	}

	if len(sets) == 0 {
		return errors.New("all fields are empty")
	}
	sqlQuery := "update nodes set " + strings.Join(sets, ", ") + " where id = ?"
	args = append(args, id)

	_, err := config.DB.Exec(sqlQuery, args...)
	return err
}

type OrdenNormalizeT struct {
	ArrIds *[]ArrIdsT
}
type ArrIdsT struct {
	Id string
}

func NormalizeOrden(body OrdenNormalizeT) error {
	tx, err := config.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	queries, err := tx.Prepare("update nodes set orden = ? where id = ?")
	if err != nil {
		return err
	}
	defer queries.Close()

	for idx, item := range *body.ArrIds {
		_, err := queries.Exec(strconv.Itoa(idx+1), item.Id)
		if err != nil {
			return err
		}
	}
	err = tx.Commit()
	if err != nil {
		return err
	}
	return nil
}

func DeleteNode(id string) error {
	sqlQuery := "delete from nodes where id = ?"
	_, err := config.DB.Exec(sqlQuery, id)
	return err
}

func GetNestedParents(parentId string) ([]ParentNodes, error) {
	query := "SELECT id, data, type FROM nodes WHERE parent_id = ? AND type = 'parent_node'"
	rows, err := config.DB.Query(query, parentId)
	if err != nil {
		return nil, err
	}
	var items []ParentNodes
	for rows.Next() {
		var node ParentNodes
		if err := rows.Scan(&node.Id, &node.Data, &node.Type); err != nil {
			return nil, err
		}
		items = append(items, node)
	}
	return items, nil
}

func GetLinkTargets() ([]ParentNodes, error) {
	query := "SELECT id, data, type FROM nodes WHERE type = 'parent_node'"
	rows, err := config.DB.Query(query)
	if err != nil {
		return nil, err
	}
	var items []ParentNodes
	for rows.Next() {
		var node ParentNodes
		if err := rows.Scan(&node.Id, &node.Data, &node.Type); err != nil {
			return nil, err
		}
		items = append(items, node)
	}
	return items, nil
}

type IncomingLink struct {
	Id   int
	Data *string
}

func GetIncomingLinks(targetId string) ([]IncomingLink, error) {
	query := "SELECT id, data FROM nodes WHERE ref_id = ? AND type = 'parent_link'"
	rows, err := config.DB.Query(query, targetId)
	if err != nil {
		return nil, err
	}
	var items []IncomingLink
	for rows.Next() {
		var link IncomingLink
		if err := rows.Scan(&link.Id, &link.Data); err != nil {
			return nil, err
		}
		items = append(items, link)
	}
	return items, nil
}
