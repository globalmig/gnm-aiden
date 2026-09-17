export type TvSpecRow = { label: string; value: React.ReactNode; bold?: boolean };

export default function TvSpecTable({ title, rows }: { title: string; rows: TvSpecRow[] }) {
  return (
    <div>
      <p className="font-bold text-title">{title}</p>
      <div className="mt-4 overflow-hidden border-t border-b border-t-table-border border-b-table-border ">
        <table className="w-full border-collapse text-sm pc:text-base">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-table-border last:border-b-0">
                <th
                  scope="row"
                  className="w-28 bg-table-head px-3 py-3.5 text-center font-medium text-title pc:w-36"
                >
                  {row.label}
                </th>
                <td className={`px-4 py-3.5 text-body ${row.bold ? "font-bold text-title" : ""}`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
