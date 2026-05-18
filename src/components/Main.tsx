import React from 'react'
function Main({ data }: { data: any[] }) {
  return (
    <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Họ tên</th>
        <th>Ngày sinh</th>
        <th>SDT</th>
        <th>Email</th>
        <th>Vai trò</th>
        <th>Avatar_url</th>
        <th>Trạng thái</th>
      </tr>
    </thead>

    <tbody>
      {data.map((item) => (
        <tr key={item.id}>
          <td>#{item.id.toString().padStart(3, '0')}</td>
          <td>{item.name}</td>
          <td>{item.birthday}</td>
          <td>{item.sdt}</td>
          <td>{item.email}</td>
          <td>{item.role}</td>
          <td>
            <img
              className="avatar"
              src={item.avatar_url}
              alt={item.name}
            />
          </td>
          <td>
            <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
        </td>
      </tr>

        ))}
    </tbody>
  </table>
</div>
  )
}

Main.propTypes = {}

export default Main
