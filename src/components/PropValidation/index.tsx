const Message = ({ name, age }: { name: number; age: string }) => {
  return (
    <>
      <h1>Hallo Nama Saya {name}</h1>
      <h1>Umur Saya {age} Tahun</h1>
    </>
  );
};

const Introduction = () => {
  return (
    <div className="container">
      <Message name={"Paijo"} age={12} />
    </div>
  );
};

export default Introduction;
